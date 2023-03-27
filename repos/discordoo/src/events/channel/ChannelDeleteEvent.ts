import { AbstractEvent, AbstractEventContext } from '@src/events'
import { ChannelTypes, EventNames } from '@src/constants'
import { AnyRawChannelData } from '@src/api/entities/channel/interfaces/AnyRawGuildChannelData'
import { channelEntityKey } from '@src/utils'
import { EntitiesUtil } from '@src/api/entities/EntitiesUtil'
import { ChannelDeleteEventContext } from '@src/events/channel/ctx/ChannelDeleteEventContext'
import { RawDirectMessagesChannelData } from '@src/api/entities/channel/interfaces/RawDirectMessagesChannelData'
import { AnyChannel } from '@src/api'

export class ChannelDeleteEvent extends AbstractEvent<ChannelDeleteEventContext | AbstractEventContext> {
  public name = EventNames.CHANNEL_DELETE

  async execute(shardId: number, data: AnyRawChannelData) {

    const entityKey = channelEntityKey(data)
    if (entityKey === 'AbstractChannel') {
      // TODO: log about unknown channel
      return {
        shardId,
      }
    }

    const Channel: any = EntitiesUtil.get(entityKey)

    let channel = await this.app.channels.cache.get(data.id, { storage: data.guild_id ?? 'dm' })

    if (channel) {
      channel = await channel.init({ ...data, deleted: true } as any)
    } else {
      channel = await new Channel(this.app).init({ ...data, deleted: true }) as AnyChannel
    }

    await this.app.channels.cache.delete(channel.id, { storage: data.guild_id ?? 'dm' })

    if (data.type === ChannelTypes.Dm || data.type === ChannelTypes.GroupDm) {
      for await (const user of (data as RawDirectMessagesChannelData).recipients) {
        await this.app.dms.cache.delete(user.id)
      }
    }

    const context: ChannelDeleteEventContext = {
      channel,
      shardId,
      channelId: channel.id,
      guildId: 'guildId' in channel ? channel.guildId : undefined,
    }

    this.app.emit(EventNames.CHANNEL_DELETE, context)
    return context
  }
}