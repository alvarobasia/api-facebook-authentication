import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import {
  CreateFacebookAccountRepository,
  LoadUserAccountRepository
} from '../contracts/repos'

export class FacebookAuthenticationService {
  constructor(
    private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi,
    private readonly LoadUserAccountRepo: LoadUserAccountRepository,
    private readonly createFacebookAccountRepo: CreateFacebookAccountRepository
  ) {}

  async perform(
    params: FacebookAuthentication.Params
  ): Promise<AuthenticationError> {
    const fbData = await this.loadFacebookUserByTokenApi.loadUser(params)
    if (fbData !== undefined) {
      await this.LoadUserAccountRepo.load({
        email: fbData?.email
      })
      await this.createFacebookAccountRepo.createFromFacebook(fbData)
    }
    return new AuthenticationError()
  }
}
