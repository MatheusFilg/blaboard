"use client";

import { LabelsTable } from "~/components/labels/labels-table";
import { OrgGuard } from "~/components/org";
import { authClient } from "~/lib/auth-client";

export default function LabelsPage() {
	const { data: session } = authClient.useSession();

	return (
		<OrgGuard>
			{session?.user && session?.session?.activeOrganizationId && (
				<LabelsTable organizationId={session?.session.activeOrganizationId} />
			)}
		</OrgGuard>
	);
}
