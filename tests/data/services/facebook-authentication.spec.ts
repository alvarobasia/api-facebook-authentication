import { LoadFacebookUserApi } from '@/data/contracts/apis'
import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository
} from '@/data/contracts/repos'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { mock, MockProxy } from 'jest-mock-extended'

describe('Facebook authentication service', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let userAccountRepo: MockProxy<
    LoadUserAccountRepository & SaveFacebookAccountRepository
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
    userAccountRepo.load.mockResolvedValue(undefined)
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
  it('should create account with facebook data', async () => {
    await sut.perform({ token })

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
      email: 'any-fb-email',
      name: 'any-fb-name',
      facebookId: 'any-fb-facebookId'
    })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  })
  it('should not update account name', async () => {
    userAccountRepo.load.mockResolvedValueOnce({
      id: 'any-id',
      name: 'any-name'
    })
    await sut.perform({ token })

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
      id: 'any-id',
      name: 'any-name',
      email: 'any-fb-email',
      facebookId: 'any-fb-facebookId'
    })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('should update account name', async () => {
    userAccountRepo.load.mockResolvedValueOnce({
      id: 'any-id'
    })
    await sut.perform({ token })

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
      id: 'any-id',
      name: 'any-fb-name',
      email: 'any-fb-email',
      facebookId: 'any-fb-facebookId'
    })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  })
})
