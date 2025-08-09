import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";

export function QRModal({ url }: { url: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="hero">Chia sẻ QR</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quét QR để xem kết quả</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center py-4">
          <div className="p-4 bg-white rounded-md">
            <QRCode value={url} size={196} />
          </div>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground break-all border-t pt-2">
            {url}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
