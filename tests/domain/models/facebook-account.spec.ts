import { FacebookAccount } from '@/domain/models'

describe('Facebook Account', () => {
  const fbData = {
    name: 'any-fb-name',
    email: 'any-fb-email',
    facebookId: 'any-fb-id'
  }
  it('should create with facebook data only', () => {
    const sut = new FacebookAccount(fbData)

    expect(sut).toEqual({
      name: 'any-fb-name',
      email: 'any-fb-email',
      facebookId: 'any-fb-id'
    })
  })

  it('should update name if its empty', () => {
    const accountData = {
      id: 'any-id'
    }

    const sut = new FacebookAccount(fbData, accountData)

    expect(sut).toEqual({
      id: 'any-id',
      name: 'any-fb-name',
      email: 'any-fb-email',
      facebookId: 'any-fb-id'
    })
  })

  it('should not update name if its not empty', () => {
    const accountData = {
      id: 'any-id',
      name: 'any-name'
    }

    const sut = new FacebookAccount(fbData, accountData)

    expect(sut).toEqual({
      id: 'any-id',
      name: 'any-name',
      email: 'any-fb-email',
      facebookId: 'any-fb-id'
    })
  })
})
