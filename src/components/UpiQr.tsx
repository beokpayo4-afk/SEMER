import { QRCodeSVG } from "qrcode.react";
import { upiPayLink } from "../utils/order.ts";

export function UpiQr({ amountPaise }: { amountPaise: number }) {
  return (
    <QRCodeSVG
      value={upiPayLink(amountPaise)}
      size={180}
      marginSize={2}
      level="M"
      title="Scan to pay with UPI"
      className="rounded-xl bg-white"
    />
  );
}
