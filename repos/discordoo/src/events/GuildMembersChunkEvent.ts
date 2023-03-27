import { AbstractEvent } from '@src/events/AbstractEvent'
import { EventNames, Keyspaces } from '@src/constants'
import { RawGuildMembersChunkData } from '@src/events/interfaces/RawGuildMembersChunkData'
import { GuildMember, Presence } from '@src/api'
import { EntitiesUtil } from '@src/api/entities/EntitiesUtil'
import { GuildMembersChunkEventContext } from '@src/events/ctx'

export class GuildMembersChunkEvent extends AbstractEvent<GuildMembersChunkEventContext> {
  public name = EventNames.GUILD_MEMBERS_CHUNK

  async execute(shardId: number, data: RawGuildMembersChunkData) {

    const owner = await this.app.internals.cache.get(
      Keyspaces.Other,
      'guild-owners',
      'any',
      data.guild_id
    )

    const ownerId = owner ? owner.id : undefined

    const members: Promise<GuildMember>[] = data.members.map(async memberData => {
      let member = await this.app.internals.cache.get<string, GuildMember>(
        Keyspaces.GuildMembers,
        data.guild_id,
        'GuildMember',
        memberData.user.id
      )

      if (member) {
        await member.init(memberData)
      } else {
        const Member = EntitiesUtil.get('GuildMember')
        member = await new Member(this.app).init({
          ...memberData, guild_id: data.guild_id, guild_owner: ownerId === memberData.user.id
        })
      }

      await this.app.members.cache.set(member.userId, member, { storage: memberData.guild_id })

      return member
    })

    const presences: Promise<Presence>[] | undefined = data.presences?.map(async presenceData => {
      let presence = await this.app.internals.cache.get<string, Presence>(
        Keyspaces.GuildPresences,
        data.guild_id,
        'Presence',
        presenceData.user.id
      )

      if (presence) {
        await presence.init(presenceData)
      } else {
        const Presence = EntitiesUtil.get('Presence')
        presence = await new Presence(this.app).init(presenceData)
      }

      await this.app.presences.cache.set(presence.userId, presence, { storage: presenceData.guild_id })

      return presence
    })

    const context: GuildMembersChunkEventContext = {
      shardId,
      members: await Promise.all(members),
      presences: presences ? await Promise.all(presences) : undefined,
      guildId: data.guild_id,
      chunkIndex: data.chunk_index,
      chunksExpected: data.chunk_count,
      last: data.chunk_count - 1 === data.chunk_index,
      nonce: data.nonce,
    }

    // console.log(context)

    const queue = data.nonce ? this.app.internals.queues.members.get(data.nonce) : undefined

    if (queue) {
      const result = queue.handler(context, queue)

      if (result !== true) {
        this.app.internals.queues.members.set(result.nonce, result)
      }
    }

    this.app.emit(EventNames.GUILD_MEMBERS_CHUNK, context)
    return context
  }

}
