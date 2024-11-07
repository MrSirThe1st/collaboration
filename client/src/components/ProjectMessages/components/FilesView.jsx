import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  File,
  Image,
  FileText,
  Download,
  MoreVertical,
  Search,
  Upload,
  Trash,
  Share2,
  FolderPlus,
} from "lucide-react";

const FilesView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFiles, setSelectedFiles] = useState(new Set());

  const files = [
    {
      id: 1,
      name: "Project Brief.pdf",
      type: "pdf",
      size: "2.4 MB",
      uploadedBy: "John Doe",
      lastModified: "2024-02-15",
    },
    {
      id: 2,
      name: "Design Assets.zip",
      type: "zip",
      size: "15.7 MB",
      uploadedBy: "Sarah Smith",
      lastModified: "2024-02-14",
    },
    {
      id: 3,
      name: "Meeting Notes.docx",
      type: "document",
      size: "542 KB",
      uploadedBy: "Mike Johnson",
      lastModified: "2024-02-13",
    },
  ];

  const getFileIcon = (type) => {
    switch (type) {
      case "pdf":
        return <FileText className="text-red-500" />;
      case "image":
        return <Image className="text-blue-500" />;
      case "zip":
        return <File className="text-yellow-500" />;
      default:
        return <File className="text-gray-500" />;
    }
  };

  const handleFileSelect = (fileId) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId);
    } else {
      newSelected.add(fileId);
    }
    setSelectedFiles(newSelected);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Files</h2>
            <p className="text-muted-foreground">
              Manage project files and documents
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <FolderPlus className="w-4 h-4 mr-2" />
              New Folder
            </Button>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          {selectedFiles.size > 0 && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="destructive" size="sm">
                <Trash className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uploaded By</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file) => (
              <TableRow
                key={file.id}
                className={selectedFiles.has(file.id) ? "bg-muted" : ""}
                onClick={() => handleFileSelect(file.id)}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getFileIcon(file.type)}
                    <span>{file.name}</span>
                  </div>
                </TableCell>
                <TableCell>{file.size}</TableCell>
                <TableCell>{file.uploadedBy}</TableCell>
                <TableCell>
                  {new Date(file.lastModified).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default FilesView;
