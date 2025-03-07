import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Plus,
  Link as LinkIcon,
  FileText,
  ExternalLink,
  Trash2,
  User,
  Calendar,
  Loader,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DOCUMENTATION_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSelector } from "react-redux";

const FilesView = ({ isMobile }) => {
  const { id: projectId } = useParams();
  const user = useSelector((state) => state.auth.user);
  const [showDialog, setShowDialog] = useState(false);
  const [resourceType, setResourceType] = useState("doc");
  const [documentation, setDocumentation] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState({
    title: "",
    content: "",
    link: "",
  });

  const fetchDocumentation = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${DOCUMENTATION_API_END_POINT}/${projectId}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setDocumentation(response.data.documentation);
      }
    } catch (error) {
      console.error("Error fetching documentation:", error);
      toast.error("Failed to load documentation");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchDocumentation();
  }, [fetchDocumentation]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!input.title) {
        toast.error("Please enter a title");
        return;
      }

      if (resourceType === "doc" && !input.content) {
        toast.error("Please enter content");
        return;
      }

      if (resourceType === "link" && !input.link) {
        toast.error("Please enter a link");
        return;
      }

      const response = await axios.post(
        `${DOCUMENTATION_API_END_POINT}/add`,
        {
          projectId,
          title: input.title,
          content: input.content,
          link: input.link,
          type: resourceType,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        setDocumentation([...documentation, response.data.documentation]);
        setShowDialog(false);
        setInput({ title: "", content: "", link: "" });
        toast.success("Documentation added successfully");
      }
    } catch (error) {
      toast.error("Failed to add documentation");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (doc) => {
    setDocumentToDelete(doc);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!documentToDelete) return;

    try {
      const response = await axios.delete(
        `${DOCUMENTATION_API_END_POINT}/${projectId}/${documentToDelete._id}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setDocumentation((docs) =>
          docs.filter((doc) => doc._id !== documentToDelete._id)
        );
        toast.success("Documentation deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting documentation:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete documentation"
      );
    } finally {
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

  const DocumentCard = ({ doc }) => {
    const createdDate = new Date(doc.createdAt).toLocaleDateString();
    const isOwner = doc.createdBy?._id === user?._id;

    return (
      <Card className="mb-4 group hover:shadow-md transition-all duration-200">
        <CardHeader
          className={cn(
            "flex flex-row items-start justify-between",
            isMobile ? "p-3" : "p-4"
          )}
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              {doc.type === "doc" ? (
                <FileText
                  className={cn(
                    "text-muted-foreground",
                    isMobile ? "h-4 w-4" : "h-5 w-5"
                  )}
                />
              ) : (
                <LinkIcon
                  className={cn(
                    "text-muted-foreground",
                    isMobile ? "h-4 w-4" : "h-5 w-5"
                  )}
                />
              )}
              <CardTitle className={cn(isMobile ? "text-base" : "text-lg")}>
                {doc.title}
              </CardTitle>
            </div>
            {isMobile && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span>{doc.createdBy?.username || "Unknown"}</span>
                <Calendar className="h-3 w-3 ml-2" />
                <span>{createdDate}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            {doc.link && (
              <Button
                variant="ghost"
                size={isMobile ? "sm" : "icon"}
                onClick={() => window.open(doc.link, "_blank")}
                className="hover:text-blue-500"
              >
                <ExternalLink className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
                {isMobile ? null : <span className="sr-only">Open link</span>}
              </Button>
            )}
            {isOwner && (
              <Button
                variant="destructive"
                size={isMobile ? "sm" : "sm"}
                onClick={() => handleDeleteClick(doc)}
                className={cn(
                  "flex items-center gap-1",
                  isMobile && "h-8 px-2"
                )}
              >
                <Trash2 className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
                {!isMobile && <span>Delete</span>}
              </Button>
            )}
          </div>
        </CardHeader>
        {doc.content && (
          <CardContent className={isMobile ? "p-3 pt-0" : "p-6 pt-0"}>
            <pre
              className={cn(
                "whitespace-pre-wrap font-sans",
                isMobile ? "text-sm max-h-40 overflow-y-auto" : ""
              )}
            >
              {doc.content}
            </pre>
          </CardContent>
        )}
        {!isMobile && doc.createdBy && (
          <CardContent className="pt-0 pb-4 italic text-sm text-muted-foreground">
            Added by {doc.createdBy.username} on {createdDate}
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "flex justify-between items-center",
          isMobile ? "flex-col gap-3" : "flex-row"
        )}
      >
        <div>
          <h2 className={cn("font-bold", isMobile ? "text-xl" : "text-2xl")}>
            Documentation
          </h2>
          <p
            className={cn(
              "text-muted-foreground",
              isMobile ? "text-xs" : "text-sm"
            )}
          >
            Project documentation and useful links
          </p>
        </div>
        <Button
          onClick={() => setShowDialog(true)}
          size={isMobile ? "sm" : "default"}
        >
          <Plus className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
          Add Documentation
        </Button>
      </div>

      <ScrollArea
        className={cn(
          isMobile ? "h-[calc(100vh-280px)]" : "h-[calc(100vh-200px)]",
          "pr-4"
        )}
      >
        {documentation.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No documentation added yet
          </div>
        ) : (
          documentation.map((doc) => <DocumentCard key={doc._id} doc={doc} />)
        )}
      </ScrollArea>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className={cn(isMobile && "w-[95vw] max-w-md p-4")}>
          <DialogHeader>
            <DialogTitle>Add Documentation</DialogTitle>
          </DialogHeader>
          <Tabs value={resourceType} onValueChange={setResourceType}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="doc">
                <FileText
                  className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")}
                />
                Write Doc
              </TabsTrigger>
              <TabsTrigger value="link">
                <LinkIcon
                  className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")}
                />
                Add Link
              </TabsTrigger>
            </TabsList>
            <TabsContent value="doc">
              <div className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={input.title}
                    onChange={(e) =>
                      setInput({ ...input, title: e.target.value })
                    }
                    placeholder="Documentation title"
                  />
                </div>
                <div>
                  <Label>Content</Label>
                  <Textarea
                    className={isMobile ? "h-[120px]" : "h-[200px]"}
                    value={input.content}
                    onChange={(e) =>
                      setInput({ ...input, content: e.target.value })
                    }
                    placeholder="Write your documentation here..."
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="link">
              <div className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={input.title}
                    onChange={(e) =>
                      setInput({ ...input, title: e.target.value })
                    }
                    placeholder="Link title"
                  />
                </div>
                <div>
                  <Label>Link</Label>
                  <Input
                    value={input.link}
                    onChange={(e) =>
                      setInput({ ...input, link: e.target.value })
                    }
                    placeholder="https://"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter className={isMobile ? "flex-col gap-2" : ""}>
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              className={isMobile ? "w-full" : ""}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className={isMobile ? "w-full" : ""}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className={isMobile ? "w-[95vw] max-w-md" : ""}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Documentation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{documentToDelete?.title}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={isMobile ? "flex-col gap-2" : ""}>
            <AlertDialogCancel
              onClick={() => {
                setDeleteDialogOpen(false);
                setDocumentToDelete(null);
              }}
              className={isMobile ? "w-full" : ""}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className={cn(
                "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                isMobile && "w-full"
              )}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FilesView;
