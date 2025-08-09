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
        <Button variant="outline">Chia sẻ QR</Button>
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
        <div className="text-center space-y-2">
          <p className="text-sm text-green-600 font-medium">
            ✅ Mã QR đơn giản - dễ quét
          </p>
          <p className="text-xs text-muted-foreground">
            Chỉ hoạt động trên thiết bị đã làm quiz này
          </p>
          <p className="text-xs text-muted-foreground break-all border-t pt-2">
            {url}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
