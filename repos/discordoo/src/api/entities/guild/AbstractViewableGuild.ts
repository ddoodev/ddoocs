import { AbstractGuild } from '@src/api/entities/guild/AbstractGuild'
import { ViewableGuild } from '@src/api/entities/guild/interfaces/ViewableGuild'
import { attach, ImageUrlOptions } from '@src/utils'
import { GuildNsfwLevels, GuildVerificationLevels } from '@src/constants'
import { ViewableGuildData } from '@src/api/entities/guild/interfaces/ViewableGuildData'
import { RawViewableGuildData } from '@src/api/entities/guild/interfaces/RawViewableGuildData'
import { Json, ToJsonProperties } from '@src/api/entities/interfaces'
import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'

export abstract class AbstractViewableGuild extends AbstractGuild implements ViewableGuild {
  public banner?: string
  public description?: string
  public declare nsfwLevel: GuildNsfwLevels
  public splash?: string
  public vanityUrlCode?: string
  public declare verificationLevel: GuildVerificationLevels

  async init(data: ViewableGuildData | RawViewableGuildData, options?: EntityInitOptions): Promise<this> {
    await super.init(data)

    attach(this, data, {
      props: [
        'banner',
        'description',
        [ 'nsfwLevel', 'nsfw_level', GuildNsfwLevels.Default ],
        'splash',
        [ 'vanityUrlCode', 'vanity_url_code' ],
        [ 'verificationLevel', 'verification_level', GuildVerificationLevels.None ],
      ],
      disabled: options?.ignore,
    })

    return this
  }

  bannerUrl(options?: ImageUrlOptions): string | undefined {
    return this.banner ? this.app.internals.rest.cdn.banner(this.id, this.banner, options) : undefined
  }

  splashUrl(options?: ImageUrlOptions): string | undefined {
    return this.splash ? this.app.internals.rest.cdn.splash(this.id, this.splash, options) : undefined
  }

  toJson(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.toJson({
      ...properties,
      banner: true,
      description: true,
      nsfwLevel: true,
      splash: true,
      vanityUrlCode: true,
      verificationLevel: true,
      membersCount: true,
      ownerId: true,
    }, obj)
  }

}