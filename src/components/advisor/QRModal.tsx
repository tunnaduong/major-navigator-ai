import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";

export function QRModal({ url }:{ url:string }){
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Chia sẻ QR</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quét để xem kết quả</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center py-4">
          <div className="p-4 bg-white rounded-md">
            <QRCode value={url} size={196} />
          </div>
        </div>
        <p className="text-sm text-muted-foreground break-all">{url}</p>
      </DialogContent>
    </Dialog>
  );
}
