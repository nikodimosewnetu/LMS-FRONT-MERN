import MediaProgressbar from "@/components/media-progress-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { InstructorContext } from "@/context/instructor-context";
import { mediaUploadService } from "@/services";
import { useContext } from "react";

function CourseSettings() {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  const handleImageUploadChange = async (event) => {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      const imageFormData = new FormData();
      imageFormData.append("file", selectedImage);
      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          imageFormData,
          setMediaUploadProgressPercentage
        );
        if (response.success) {
          setCourseLandingFormData({
            ...courseLandingFormData,
            image: response.data.url,
          });
          setMediaUploadProgress(false);
        }
      } catch (e) {
        console.error(e);
        setMediaUploadProgress(false);
      }
    }
  };

  const handleRemoveImage = () => {
    setCourseLandingFormData({ ...courseLandingFormData, image: "" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Settings</CardTitle>
      </CardHeader>
      <div className="p-4">
        {mediaUploadProgress && (
          <MediaProgressbar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage}
          />
        )}
      </div>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Label>Course Image</Label>
          {courseLandingFormData?.image ? (
            <div className="flex flex-col items-start gap-3">
              <img
                src={courseLandingFormData.image}
                alt="Course"
                className="w-40 h-40 object-cover rounded-lg border"
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleRemoveImage}>
                  Remove
                </Button>
                <Label className="cursor-pointer">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUploadChange}
                    className="hidden"
                  />
                  <span className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer">
                    Change
                  </span>
                </Label>
              </div>
            </div>
          ) : (
            <Input type="file" accept="image/*" onChange={handleImageUploadChange} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseSettings;
