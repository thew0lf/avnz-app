import * as React from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";
import { X, Info } from "lucide-react";

export function RolePermissionsModal() {
    const [open, setOpen] = React.useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Update Role</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-3xl">
                <DialogHeader className="flex items-center justify-between">
                    <DialogTitle>Update Role</DialogTitle>
                    <DialogClose asChild>
                        <button aria-label="Close">
                        </button>
                    </DialogClose>
                </DialogHeader>

                <div className="mx-5 my-7 overflow-y-auto max-h-[32rem]">
                    <form id="update-role-form" className="space-y-10">
                        <div className="space-y-2">
                            <Label htmlFor="role_name" className="font-semibold">
                                Role name
                            </Label>
                            <Input
                                id="role_name"
                                name="role_name"
                                placeholder="Enter a role name"
                                defaultValue="Administrator"

                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="font-semibold">Role Permissions</Label>
                            <ScrollArea className="max-h-[20rem] border rounded-md p-2">
                                <table className="min-w-full text-sm divide-y divide-gray-200">
                                    <tbody className="bg-white">
                                    <tr>
                                        <td className="py-4 font-semibold text-gray-800 flex items-center">
                                            Administrator Access
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info className="ml-1 h-4 w-4 text-gray-500" />
                                                    </TooltipTrigger>
                                                    <TooltipContent side="right">
                                                        Allows full access to the system
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center">
                                                <Checkbox id="select_all" />
                                                <Label htmlFor="select_all" className="ml-2">
                                                    Select all
                                                </Label>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="py-4 font-semibold text-gray-800">
                                            User Management
                                        </td>
                                        <td className="py-4">
                                            <div className="flex space-x-5">
                                                <div className="flex items-center">
                                                    <Checkbox id="user_management_read" name="user_management_read" />
                                                    <Label htmlFor="user_management_read" className="ml-2">
                                                        Read
                                                    </Label>
                                                </div>
                                                <div className="flex items-center">
                                                    <Checkbox id="user_management_write" name="user_management_write" />
                                                    <Label htmlFor="user_management_write" className="ml-2">
                                                        Write
                                                    </Label>
                                                </div>
                                                <div className="flex items-center">
                                                    <Checkbox id="user_management_create" name="user_management_create" />
                                                    <Label htmlFor="user_management_create" className="ml-2">
                                                        Create
                                                    </Label>
                                                </div>
                                                <div className="flex items-center">
                                                    <Checkbox id="user_management_delete" name="user_management_delete" />
                                                    <Label htmlFor="user_management_delete" className="ml-2">
                                                        Delete
                                                    </Label>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-4 font-semibold text-gray-800">
                                            Role Management
                                        </td>
                                        <td className="py-4">
                                            <div className="flex space-x-5">
                                                <div className="flex items-center">
                                                    <Checkbox id="user_management_read" name="user_management_read" />
                                                    <Label htmlFor="user_management_read" className="ml-2">
                                                        Read
                                                    </Label>
                                                </div>
                                                <div className="flex items-center">
                                                    <Checkbox id="user_management_write" name="user_management_write" />
                                                    <Label htmlFor="user_management_write" className="ml-2">
                                                        Write
                                                    </Label>
                                                </div>
                                                <div className="flex items-center">
                                                    <Checkbox id="user_management_create" name="user_management_create" />
                                                    <Label htmlFor="user_management_create" className="ml-2">
                                                        Create
                                                    </Label>
                                                </div>
                                                <div className="flex items-center">
                                                    <Checkbox id="user_management_delete" name="user_management_delete" />
                                                    <Label htmlFor="user_management_delete" className="ml-2">
                                                        Delete
                                                    </Label>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* …other permission rows… */}
                                    </tbody>
                                </table>
                            </ScrollArea>
                        </div>
                    </form>
                </div>

                <DialogFooter className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Discard
                    </Button>
                    <Button type="submit" form="update-role-form">
                        Submit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
