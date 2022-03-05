import { LoadFacebookUserApi } from '@/data/contracts/apis'
import {
  CreateFacebookAccountRepository,
  LoadUserAccountRepository
} from '@/data/contracts/repos'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { mock, MockProxy } from 'jest-mock-extended'

describe('Facebook authentication service', () => {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
  let loadUserAccountRepo: MockProxy<LoadUserAccountRepository>
  let createFacebookAccountRepo: MockProxy<CreateFacebookAccountRepository>
  let sut: FacebookAuthenticationService
  const token = 'any-token'
  beforeEach(() => {
    loadFacebookUserApi = mock()

    loadFacebookUserApi.loadUser.mockResolvedValue({
      name: 'any-fb-name',
      email: 'any-fb-email',
      facebookId: 'any-fb-facebookId'
    })
    loadUserAccountRepo = mock()
    createFacebookAccountRepo = mock()
    sut = new FacebookAuthenticationService(
      loadFacebookUserApi,
      loadUserAccountRepo,
      createFacebookAccountRepo
    )
  })
  it('Should call LoadFacebookApi with correct params', async () => {
    await sut.perform({ token })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({
      token: 'any-token'
    })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('Should return an error when Facebook api returns undefined', async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ token })
    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserAccountRepo when LoadFacebookApi returns data', async () => {
    await sut.perform({ token })

    expect(loadUserAccountRepo.load).toHaveBeenCalledWith({
      email: 'any-fb-email'
    })
    expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1)
  })
  it('should call CreateUserAccountRepo when LoadUserFacebookApi returns undefined', async () => {
    loadUserAccountRepo.load.mockResolvedValueOnce(undefined)
    await sut.perform({ token })

    expect(createFacebookAccountRepo.createFromFacebook).toHaveBeenCalledWith({
      email: 'any-fb-email',
      name: 'any-fb-name',
      facebookId: 'any-fb-facebookId'
    })
    expect(createFacebookAccountRepo.createFromFacebook).toHaveBeenCalledTimes(
      1
    )
  })
})
