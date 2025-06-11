
import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash2, Edit } from 'lucide-react';

interface DeleteDropdownProps {
  onDelete: () => void;
  onEdit?: () => void;
  isOwner: boolean;
}

const DeleteDropdown = ({ onDelete, onEdit, isOwner }: DeleteDropdownProps) => {
  if (!isOwner) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {onEdit && (
          <DropdownMenuItem onClick={onEdit} className="flex items-center">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </DropdownMenuItem>
        )}
        <DropdownMenuItem 
          onClick={onDelete}
          className="flex items-center text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DeleteDropdown;
