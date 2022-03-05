import { LoadFacebookUserApi } from '@/data/contracts/apis'
import {
  CreateFacebookAccountRepository,
  LoadUserAccountRepository
} from '@/data/contracts/repos'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { mock, MockProxy } from 'jest-mock-extended'

describe('Facebook authentication service', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let userAccountRepo: MockProxy<
    LoadUserAccountRepository & CreateFacebookAccountRepository
  >
  let sut: FacebookAuthenticationService
  const token = 'any-token'
  beforeEach(() => {
    facebookApi = mock()

    facebookApi.loadUser.mockResolvedValue({
      name: 'any-fb-name',
      email: 'any-fb-email',
      facebookId: 'any-fb-facebookId'
    })
    userAccountRepo = mock()
    sut = new FacebookAuthenticationService(facebookApi, userAccountRepo)
  })
  it('Should call LoadFacebookApi with correct params', async () => {
    await sut.perform({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledWith({
      token: 'any-token'
    })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('Should return an error when Facebook api returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ token })
    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserAccountRepo when LoadFacebookApi returns data', async () => {
    await sut.perform({ token })

    expect(userAccountRepo.load).toHaveBeenCalledWith({
      email: 'any-fb-email'
    })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })
  it('should call CreateUserAccountRepo when LoadUserFacebookApi returns undefined', async () => {
    userAccountRepo.load.mockResolvedValueOnce(undefined)
    await sut.perform({ token })

    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledWith({
      email: 'any-fb-email',
      name: 'any-fb-name',
      facebookId: 'any-fb-facebookId'
    })
    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1)
  })
})
