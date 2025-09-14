import { ForGettingTime } from '../../inventory/driven/forGettingTime/ForGettingTime'

export class ForGettingTimeSystemAdapter implements ForGettingTime {
  now(): Date {
    return new Date()
  }
}
