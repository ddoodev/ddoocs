import { InteractionTypes } from '@src/constants'
import { ChannelResolvable, GuildResolvable, MessageResolvable, UserResolvable } from '@src/api'
import { GuildMemberResolvable } from '@src/api/entities/member/interfaces/GuildMemberResolvable'

export interface InteractionData<DataType = any> {
  /** id of the interaction */
  id: string
  /** id of the application this interaction is for */
  applicationId: string
  /** the type of interaction */
  type: InteractionTypes
  /** the guild it was sent from */
  guild?: GuildResolvable
  /** the channel it was sent from */
  channel?: ChannelResolvable
  /** guild member data for the invoking user */
  member?: GuildMemberResolvable
  /**	user object for the invoking user, if invoked in a Dm */
  user?: UserResolvable
  /** a continuation token for responding to the interaction */
  token: string
  /** for components, the message they were attached to */
  message?: MessageResolvable
  version: number
  /** the selected language of the invoking user */
  locale?: string
  /** the guild's preferred locale, if invoked in a guild */
  guildLocale?: string
  /** the data for the interaction */
  data: DataType
}