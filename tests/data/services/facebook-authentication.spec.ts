import { FacebookAuthentication } from '@/domain/features'

class FacebookAuthenticationService {
  constructor(
    private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi
  ) {}

  async perform(params: FacebookAuthentication.Params): Promise<void> {
    await this.loadFacebookUserByTokenApi.loadUser(params)
  }
}

interface LoadFacebookUserApi {
  loadUser: (params: LoadFacebookUserByTokenApi.Params) => Promise<void>
}
namespace LoadFacebookUserByTokenApi {
  export type Params = {
    token: string
  }
}

class LoadFacebookUserByTokenApiSpy implements LoadFacebookUserApi {
  token?: string
  async loadUser(params: LoadFacebookUserByTokenApi.Params): Promise<void> {
    this.token = params.token
  }
}

describe('Facebook authentication service', () => {
  it('Should call LoadFacebookApi with correct params', async () => {
    const loadFacebookUserApi = new LoadFacebookUserByTokenApiSpy()
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)

    await sut.perform({ token: 'any-token' })
    expect(loadFacebookUserApi.token).toBe('any-token')
  })
})
