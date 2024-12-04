import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Link as LinkIcon,
  FileText,
  ExternalLink,
  Trash2,
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

const FilesView = () => {
  const { id: projectId } = useParams();
  const user = useSelector((state) => state.auth.user);

  const [showDialog, setShowDialog] = useState(false);
  const [resourceType, setResourceType] = useState("doc");
  const [documentation, setDocumentation] = useState([]);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);

  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    title: "",
    content: "",
    link: "",
  });

  useEffect(() => {
    const fetchDocumentation = async () => {
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
      }
    };

    fetchDocumentation();
  }, [projectId]);

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
    // Console logs should be inside the component function
    console.log("Doc creator ID:", doc.createdBy);
    console.log("Current user ID:", user?._id);

    return (
      <Card className="mb-4 group hover:shadow-md transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            {doc.type === "doc" ? (
              <FileText className="h-5 w-5 text-muted-foreground" />
            ) : (
              <LinkIcon className="h-5 w-5 text-muted-foreground" />
            )}
            <CardTitle className="text-lg">{doc.title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {doc.link && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open(doc.link, "_blank")}
                className="hover:text-blue-500"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
            {/* Updated comparison to use the _id from the createdBy object */}
            {doc.createdBy?._id === user?._id && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteClick(doc)}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        {doc.content && (
          <CardContent>
            <pre className="whitespace-pre-wrap font-sans">{doc.content}</pre>
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Documentation</h2>
          <p className="text-sm text-muted-foreground">
            Project documentation and useful links
          </p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Documentation
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        {documentation.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No documentation added yet
          </div>
        ) : (
          documentation.map((doc) => <DocumentCard key={doc._id} doc={doc} />)
        )}
      </ScrollArea>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Documentation</DialogTitle>
          </DialogHeader>
          <Tabs value={resourceType} onValueChange={setResourceType}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="doc">
                <FileText className="w-4 h-4 mr-2" />
                Write Doc
              </TabsTrigger>
              <TabsTrigger value="link">
                <LinkIcon className="w-4 h-4 mr-2" />
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
                    className="h-[200px]"
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Documentation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{documentToDelete?.title}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteDialogOpen(false);
                setDocumentToDelete(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
