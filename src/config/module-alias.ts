import { addAlias } from 'module-alias/index'
import { resolve } from 'path'

addAlias('@', resolve('dist'))
