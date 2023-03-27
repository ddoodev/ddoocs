import { Collection } from '@discordoo/collection'
import { GuildMembersChunkHandlerContext } from '@src/events/interfaces/GuildMembersChunkHandlerContext'
import { ShardConnectedHandlerContext } from '@src/events/interfaces/ShardConnectedHandlerContext'

export interface ApplicationQueues {
  members: Collection<string, GuildMembersChunkHandlerContext>
  ready: Collection<number, ShardConnectedHandlerContext>
}
