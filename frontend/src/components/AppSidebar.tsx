import { Home, Settings, SquareTerminal } from "lucide-react";
import { Billing } from "./Billing";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter,
  SidebarHeader,
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from "./ui/sidebar";

function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="h-14 border-b flex items-center justify-center">
        <div className="text-lg font-semibold">GlobSEO</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#">
                <Home />
                <span>Home</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#">
                <SquareTerminal />
                <span>API</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#">
                <Settings />
                <span>Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Billing />
      </SidebarFooter>
    </Sidebar>
  );
}

export { AppSidebar };
