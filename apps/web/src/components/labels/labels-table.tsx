import { useLabels } from "~/hooks/use-labels";
import { Sidebar } from "../board";
import { Button } from "../ui/button";
import { useMemo, useState } from "react";
import { CreateLabelModal } from "./create-label-modal";
import type { CreateLabelInput } from "~/lib/types";
import { toast } from "sonner";
import { useCreateLabel } from "~/hooks/labels/use-labels-mutations";
import { LabelsHeader } from "./labels-header";

interface LabelsTableProps {
  organizationId: string;
}

export function LabelsTable({ organizationId }: LabelsTableProps) {
  const { data: labels } = useLabels(organizationId)
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const createLabelMutation = useCreateLabel(organizationId)
  
  const filteredLabels = useMemo(() => {
     if (!labels) return []
 
     return labels.filter((label) =>
       label.text.toLowerCase().includes(searchQuery.toLowerCase())
     );
   }, [labels, searchQuery]); 
  
  const handleCreateLabel = async (
    input: Omit<CreateLabelInput, "organizationId">,
  ) => {
    try {
      await createLabelMutation.mutateAsync({
        ...input,
        organizationId,
      });
      toast.success("Label created successfully");
    } catch {
      toast.error("Failed to create label");
    }
  };
  
  function formatDate(date: Date | string | null): string {
    if (!date) return "Not set";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className="flex h-screen bg-background">
				<Sidebar />

				<main className="flex flex-1 flex-col gap-5 overflow-hidden p-5">
        <LabelsHeader
          title="Labels"
          subtitle={`${filteredLabels?.length ?? 0} Labels`}
          onNewLabel={() => setIsModalOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

					<div className="flex-1 overflow-auto">
						{" "}
						<table className="w-full">
							<thead className="border-border border-b">
								<tr>
									<th className="px-5 py-3 text-left font-semibold text-muted-foreground text-sm">
										Name
									</th>
									<th className="px-5 py-3 text-left font-semibold text-muted-foreground text-sm">
										Created
									</th>
									<th className="px-5 py-3 text-left font-semibold text-muted-foreground text-sm">
										Updated
									</th>
									<th className="px-5 py-3 text-right font-semibold text-muted-foreground text-sm">
										Actions
									</th>
								</tr>
							</thead>
							<tbody>
              {filteredLabels?.map((label) => {
                return (
                  <tr
                    className="border-border border-b transition-colors last:border-b-0 hover:bg-secondary/30"
                    key={label.id}
                  >
                    <td className="flex items-center gap-2 px-5 py-3">
                      <span
                        className="inline-block h-3 w-3 rounded-full"
                        style={{ backgroundColor: `${label.color}` }}
                      />
                      <span className="font-medium text-foreground">
                        {label.text}
                      </span>
                    </td>
                    
  									<td className="px-5 py-3 text-muted-foreground text-sm">
  										{formatDate(label.createdAt)}
                    </td>
                    
  									<td className="px-5 py-3 text-muted-foreground text-sm">
  										{formatDate(label.updatedAt)}
                    </td>
                    
  									<td className="px-5 py-3 text-right">
  										<div className="flex items-center justify-end gap-2">
  											<Button
                          type="button"
                          variant="outline"
  												className="text-muted-foreground transition-colors hover:text-foreground"
  											>
  												Edit
  											</Button>
  											<Button
                          type="button"
                          variant="destructive"
                					className="text-destructive transition-colors hover:text-destructive/90"
  											>
  												Delete
  											</Button>
  										</div>
  									</td>
                  </tr>
              )})}
							</tbody>
						</table>
					</div>
        </main>
      
      <CreateLabelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateLabel}
      />
			</div>
  )
}
