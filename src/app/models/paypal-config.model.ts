import { IPayPalConfig } from 'ngx-paypal';

export interface PayPalConfigExtended extends IPayPalConfig {
  onApprovePayment?: (data: any, actions: any) => void;
}