import {
  LoadFacebookUserApi,
  LoadFacebookUserByTokenApi
} from '@/data/contracts/apis'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'

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
