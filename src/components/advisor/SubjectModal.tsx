import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

// Component hiển thị curriculum cho một ngành
function CurriculumDisplay({ major }: { major: any }) {
  if (!major.curriculum) return null;

  const semesters = Object.entries(major.curriculum).map(
    ([key, subjects]: [string, any]) => ({
      name: key,
      subjects: subjects || [],
    })
  );

  return (
    <div className="mt-4">
      <h4 className="font-semibold text-sm mb-3">📚 Chương trình học:</h4>
      <Accordion type="single" collapsible className="w-full">
        {semesters.map((semester, index) => (
          <AccordionItem key={semester.name} value={semester.name}>
            <AccordionTrigger className="text-sm">
              Kỳ {index + 1} ({semester.subjects.length} môn)
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-2">
                {semester.subjects.map((subject: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center text-xs p-2 bg-muted/50 rounded"
                  >
                    <span className="font-medium">{subject.name}</span>
                    <div className="flex gap-2 items-center">
                      <Badge variant="outline" className="text-xs">
                        {subject.code}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {subject.credits} tín chỉ
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

// Component hiển thị skills cho một ngành
function SkillsDisplay({ major }: { major: any }) {
  if (!major.skills) return null;

  return (
    <div className="mt-3">
      <h4 className="font-semibold text-sm mb-2">💡 Kỹ năng cần có:</h4>
      <div className="flex flex-wrap gap-1">
        {major.skills.map((skill: string, index: number) => (
          <Badge key={index} variant="outline" className="text-xs">
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
}

interface SubjectModalProps {
  major: any;
  triggerText: string;
}

export function SubjectModal({ major, triggerText }: SubjectModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs">
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{major.name_vi} - Chi tiết môn học</DialogTitle>
          <DialogDescription>
            Thông tin về kỹ năng cần có và chương trình học của ngành{" "}
            {major.name_vi}
          </DialogDescription>
        </DialogHeader>
        <div className="border-t pt-3">
          <SkillsDisplay major={major} />
          <CurriculumDisplay major={major} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
