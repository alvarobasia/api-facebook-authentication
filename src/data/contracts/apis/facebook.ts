export interface LoadFacebookUserApi {
  loadUser: (
    params: LoadFacebookUserByTokenApi.Params
  ) => Promise<LoadFacebookUserByTokenApi.Result>
}
export namespace LoadFacebookUserByTokenApi {
  export type Params = {
    token: string
  }
  export type Result = undefined | {
    name: string
    email: string
    facebookId: string
  }
}
