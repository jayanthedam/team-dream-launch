
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ImageIcon, Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onImageSelect: (imageUrl: string) => void;
  currentImage?: string;
  onRemoveImage?: () => void;
}

const RANDOM_IMAGES = [
  'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop',
];

const ImageUpload = ({ onImageSelect, currentImage, onRemoveImage }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [showRandomImages, setShowRandomImages] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      onImageSelect(publicUrl);
      
      toast({
        title: "Success! 📸",
        description: "Image uploaded successfully.",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset the input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const selectRandomImage = (imageUrl: string) => {
    onImageSelect(imageUrl);
    setShowRandomImages(false);
  };

  if (currentImage) {
    return (
      <div className="relative">
        <img
          src={currentImage}
          alt="Selected"
          className="w-full h-48 object-cover rounded-lg"
        />
        {onRemoveImage && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onRemoveImage}
            className="absolute top-2 right-2"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="flex-1">
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={uploadImage}
            disabled={uploading}
            className="hidden"
          />
          <label htmlFor="image-upload">
            <Button
              variant="outline"
              className="w-full cursor-pointer"
              disabled={uploading}
              asChild
            >
              <span>
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Image'}
              </span>
            </Button>
          </label>
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowRandomImages(!showRandomImages)}
          className="px-4"
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          Random
        </Button>
      </div>

      {showRandomImages && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-2">
              {RANDOM_IMAGES.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`Random option ${index + 1}`}
                  className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => selectRandomImage(imageUrl)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageUpload;
