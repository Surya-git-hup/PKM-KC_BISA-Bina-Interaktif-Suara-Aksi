import React, { useRef } from 'react';
import { Camera, User } from 'lucide-react';

interface UserAvatarProps {
  avatar?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  editable?: boolean;
  onPhotoChange?: (dataUrl: string) => void;
  editTooltip?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  avatar,
  name = 'Pengguna',
  size = 'md',
  className = '',
  editable = false,
  onPhotoChange,
  editTooltip = 'Ubah foto profil'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isImageUrl = (val?: string): boolean => {
    if (!val) return false;
    return (
      val.startsWith('data:image/') ||
      val.startsWith('http://') ||
      val.startsWith('https://') ||
      val.startsWith('/images/') ||
      val.startsWith('/') ||
      val.includes('.jpg') ||
      val.includes('.png') ||
      val.includes('.webp')
    );
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'xs':
        return 'w-7 h-7 text-xs';
      case 'sm':
        return 'w-8 h-8 text-sm';
      case 'md':
        return 'w-10 h-10 text-base';
      case 'lg':
        return 'w-14 h-14 text-2xl';
      case 'xl':
        return 'w-20 h-20 text-3xl';
      case '2xl':
        return 'w-24 h-24 text-4xl';
      default:
        return 'w-10 h-10 text-base';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: max 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran foto terlalu besar. Maksimal 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result && onPhotoChange) {
        onPhotoChange(result);
      }
    };
    reader.readAsDataURL(file);

    // Reset input
    e.target.value = '';
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const hasImage = isImageUrl(avatar);

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      <div
        className={`${getSizeClasses()} rounded-full overflow-hidden flex items-center justify-center font-['Fredoka'] font-bold select-none border-2 border-white shadow-xs ${
          hasImage ? 'bg-slate-100' : 'bg-gradient-to-br from-amber-200 to-amber-400 text-amber-950'
        }`}
      >
        {hasImage ? (
          <img
            src={avatar}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to initial if image fails
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : avatar ? (
          <span>{avatar}</span>
        ) : (
          <span>{name.charAt(0).toUpperCase()}</span>
        )}
      </div>

      {editable && onPhotoChange && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={triggerUpload}
            title={editTooltip}
            className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shadow-md border-2 border-white transition-transform hover:scale-110 active:scale-95 cursor-pointer z-10"
          >
            <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </>
      )}
    </div>
  );
};
