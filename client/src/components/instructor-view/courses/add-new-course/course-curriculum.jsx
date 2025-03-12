// CourseCurriculum.js
import MediaProgressbar from "@/components/media-progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import VideoPlayer from "@/components/video-player";
import { courseCurriculumInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import {
  mediaBulkUploadService,
  mediaDeleteService,
  mediaUploadService,
} from "@/services";
import { Upload } from "lucide-react";
import { useContext, useRef } from "react";

function CourseCurriculum() {
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  const bulkUploadInputRef = useRef(null);

  const handleNewLecture = () => {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      { ...courseCurriculumInitialFormData[0] },
    ]);
  };

  const handleCourseTitleChange = (event, currentIndex) => {
    const updatedCourseData = [...courseCurriculumFormData];
    updatedCourseData[currentIndex].title = event.target.value;
    setCourseCurriculumFormData(updatedCourseData);
  };

  const handleFreePreviewChange = (currentValue, currentIndex) => {
    const updatedCourseData = [...courseCurriculumFormData];
    updatedCourseData[currentIndex].freePreview = currentValue;
    setCourseCurriculumFormData(updatedCourseData);
  };

  const handleSingleLectureUpload = async (event, currentIndex) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const videoFormData = new FormData();
      videoFormData.append("file", selectedFile);
      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          videoFormData,
          setMediaUploadProgressPercentage
        );
        if (response.success) {
          const updatedCourseData = [...courseCurriculumFormData];
          updatedCourseData[currentIndex] = {
            ...updatedCourseData[currentIndex],
            videoUrl: response?.data?.url,
            public_id: response?.data?.public_id,
          };
          setCourseCurriculumFormData(updatedCourseData);
        }
        setMediaUploadProgress(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleReplaceVideo = async (currentIndex) => {
    const updatedCourseData = [...courseCurriculumFormData];
    const currentVideoPublicId = updatedCourseData[currentIndex].public_id;
    try {
      const deleteResponse = await mediaDeleteService(currentVideoPublicId);
      if (deleteResponse?.success) {
        updatedCourseData[currentIndex] = {
          ...updatedCourseData[currentIndex],
          videoUrl: "",
          public_id: "",
        };
        setCourseCurriculumFormData(updatedCourseData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMediaBulkUpload = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    const bulkFormData = new FormData();
    selectedFiles.forEach((file) => bulkFormData.append("files", file));

    try {
      setMediaUploadProgress(true);
      const response = await mediaBulkUploadService(
        bulkFormData,
        setMediaUploadProgressPercentage
      );
      if (response?.success) {
        const updatedCourseData = [
          ...courseCurriculumFormData,
          ...response?.data.map((item, index) => ({
            videoUrl: item?.url,
            public_id: item?.public_id,
            title: `Lecture ${courseCurriculumFormData.length + (index + 1)}`,
            freePreview: false,
          })),
        ];
        setCourseCurriculumFormData(updatedCourseData);
        setMediaUploadProgress(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const isCourseCurriculumFormDataValid = () => {
    return courseCurriculumFormData.every(
      (item) => item.title.trim() !== "" && item.videoUrl.trim() !== ""
    );
  };

  const handleOpenBulkUploadDialog = () => {
    bulkUploadInputRef.current?.click();
  };

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Create Course Curriculum</CardTitle>
        <div>
          <Input
            type="file"
            ref={bulkUploadInputRef}
            accept="video/*"
            multiple
            className="hidden"
            id="bulk-media-upload"
            onChange={handleMediaBulkUpload}
          />
          <Button
            as="label"
            htmlFor="bulk-media-upload"
            variant="outline"
            className="cursor-pointer"
            onClick={handleOpenBulkUploadDialog}
          >
            <Upload className="w-4 h-5 mr-2" />
            Bulk Upload
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Button
          disabled={!isCourseCurriculumFormDataValid() || mediaUploadProgress}
          onClick={handleNewLecture}
        >
          Add Lecture
        </Button>
        {mediaUploadProgress && (
          <MediaProgressbar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage}
          />
        )}
        <div className="mt-4 space-y-4">
          {courseCurriculumFormData.map((curriculumItem, index) => (
            <div className="border p-5 rounded-md" key={index}>
              <div className="flex gap-5 items-center">
                <h3 className="font-semibold">Lecture {index + 1}</h3>
                <Input
                  name={`title-${index + 1}`}
                  placeholder="Enter lecture title"
                  className="max-w-96"
                  onChange={(event) => handleCourseTitleChange(event, index)}
                  value={courseCurriculumFormData[index]?.title}
                />
                <div className="flex items-center space-x-2">
                  <Switch
                    onCheckedChange={(value) =>
                      handleFreePreviewChange(value, index)
                    }
                    checked={courseCurriculumFormData[index]?.freePreview}
                    id={`freePreview-${index + 1}`}
                  />
                  <Label htmlFor={`freePreview-${index + 1}`}>
                    Free Preview
                  </Label>
                </div>
              </div>
              <div className="mt-6">
                {courseCurriculumFormData[index]?.videoUrl ? (
                  <div className="flex gap-3">
                    <VideoPlayer
                      url={courseCurriculumFormData[index]?.videoUrl}
                      width="450px"
                      height="200px"
                    />
                    <Button onClick={() => handleReplaceVideo(index)}>
                      Replace Video
                    </Button>
                    <Button
                      onClick={() => handleDeleteLecture(index)}
                      className="bg-red-900"
                    >
                      Delete Lecture
                    </Button>
                  </div>
                ) : (
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={(event) =>
                      handleSingleLectureUpload(event, index)
                    }
                    className="mb-4"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseCurriculum;

