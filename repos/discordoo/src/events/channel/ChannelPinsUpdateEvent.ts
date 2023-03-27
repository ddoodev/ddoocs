import { AbstractEvent, ChannelPinsUpdateEventContext } from '@src/events'
import { EventNames } from '@src/constants'
import { RawChannelPinsUpdateEventData } from '@src/events/channel/RawChannelPinsUpdateEventData'
import { AnyWritableChannel } from '@src/api'

export class ChannelPinsUpdateEvent extends AbstractEvent<ChannelPinsUpdateEventContext> {
  public name = EventNames.CHANNEL_PINS_UPDATE

  async execute(shardId: number, data: RawChannelPinsUpdateEventData) {
    const timestamp = data.last_pin_timestamp ? new Date(data.last_pin_timestamp) : undefined

    const channel = await this.app.channels.cache.get<AnyWritableChannel>(data.channel_id, {
      storage: data.guild_id ?? 'dm',
    })

    if (channel) {
      channel.lastPinTimestamp = timestamp?.getTime() ?? channel.lastPinTimestamp
    }

    const context: ChannelPinsUpdateEventContext = {
      shardId,
      channel,
      channelId: data.channel_id,
      guildId: data.guild_id,
      lastPinDate: timestamp,
      lastPinTimestamp: timestamp?.getTime()
    }

    this.app.emit(EventNames.CHANNEL_PINS_UPDATE, context)
    return context
  }
}