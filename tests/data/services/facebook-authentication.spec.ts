import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'

class FacebookAuthenticationService {
  constructor(
    private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi
  ) {}

  async perform(
    params: FacebookAuthentication.Params
  ): Promise<AuthenticationError> {
    await this.loadFacebookUserByTokenApi.loadUser(params)
    return new AuthenticationError()
  }
}

interface LoadFacebookUserApi {
  loadUser: (
    params: LoadFacebookUserByTokenApi.Params
  ) => Promise<LoadFacebookUserByTokenApi.Result>
}
namespace LoadFacebookUserByTokenApi {
  export type Params = {
    token: string
  }
  export type Result = undefined
}

class LoadFacebookUserByTokenApiSpy implements LoadFacebookUserApi {
  token?: string
  result = undefined
  async loadUser(
    params: LoadFacebookUserByTokenApi.Params
  ): Promise<LoadFacebookUserByTokenApi.Result> {
    this.token = params.token
    return this.result
  }
}

describe('Facebook authentication service', () => {
  it('Should call LoadFacebookApi with correct params', async () => {
    const loadFacebookUserApi = new LoadFacebookUserByTokenApiSpy()
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)

    await sut.perform({ token: 'any-token' })
    expect(loadFacebookUserApi.token).toBe('any-token')
  })

  it('Should return an error when Facebook api returns undefined', async () => {
    const loadFacebookUserApi = new LoadFacebookUserByTokenApiSpy()
    loadFacebookUserApi.result = undefined
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)

    const authResult = await sut.perform({ token: 'any-token' })
    expect(authResult).toEqual(new AuthenticationError())
  })
})
