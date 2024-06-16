export type TStatus  ='available' | 'unavailable'

export type TCar = {
    name: string;
    description: string;
    color: string;
    isElectric: boolean;
    features: string[];
    pricePerHour: number;
    status: TStatus;
    isDeleted: boolean;
  }
  