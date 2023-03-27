import { GatewayBotInfo, GatewayProvider, GatewayReceivePayloadLike, GatewaySendOptions, GatewayShardsInfo } from '@discordoo/providers'
import { DiscordApplication } from '@src/core'
import { WebSocketManager } from '@src/gateway/WebSocketManager'
import { CompletedGatewayOptions } from '@src/gateway/interfaces/GatewayOptions'
import { GatewaySendPayloadLike } from '@discordoo/providers'

export class DefaultGatewayProvider implements GatewayProvider {
  public app: DiscordApplication
  private manager: WebSocketManager
  private options: CompletedGatewayOptions

  constructor(app: DiscordApplication, options: CompletedGatewayOptions) {
    this.app = app
    this.options = options

    this.manager = new WebSocketManager(this, options)
  }

  connect(shards?: GatewayShardsInfo): Promise<unknown> {
    return this.manager.connect(shards)
  }

  async disconnect(shards?: number[]): Promise<unknown> {
    return this.manager.disconnect(shards)
  }

  emit(shardId: number, packet: GatewayReceivePayloadLike): unknown {
    // if (event !== 'PresenceUpdate') console.log('shard', shardId, 'event', event)
    // else if (data[0]?.user?.id === '164417009977786368') console.log('ceo update', event, data)
    return this.app.internals.gateway.emit(
      shardId,
      packet
    )
  }

  getGateway(): Promise<GatewayBotInfo> {
    return this.app.internals.gateway.getGateway()
  }

  ping(): number
  ping(shards: number[]): Array<[ number, number ]>
  ping(shards?: number[]): number | Array<[ number, number ]> {
    switch (Array.isArray(shards)) {
      case true:
        return shards!.map(id => ([ id, this.manager.shards.get(id)?.ping ?? -1 ]))
      case false:
        return (this.manager.shards.reduce((prev, curr) => prev + curr.ping, 0) / this.manager.shards.size) | 1
    }
  }

  reorganizeShards(shards: GatewayShardsInfo): Promise<unknown> {
    this.manager.destroy()
    return this.manager.connect(shards)
  }

  async reconnect(shards?: number[]): Promise<unknown> {
    switch (Array.isArray(shards)) {
      case true:
        return shards!.forEach(shard => this.manager.shards.get(shard)?.destroy({ reconnect: true }))
      case false:
        return this.manager.shards.forEach(shard => shard.destroy({ reconnect: true }))
    }
  }

  send(data: GatewaySendPayloadLike, options: GatewaySendOptions = {}): unknown {
    switch (Array.isArray(options.shards)) {
      case true:
        options.shards!.forEach(id => this.manager.shards.get(id)?.socketSend(data))
        break
      case false:
        this.manager.shards.forEach(shard => shard.socketSend(data))
    }

    return undefined
  }

  waitShardSpawnTurn(shardId: number): Promise<unknown> {
    return this.app.internals.gateway.waitShardSpawnTurn(shardId)
  }

  async init(): Promise<unknown> {
    return undefined
  }

}
