import React from "react";
import {
  AvatarPreview as BaseAvatarPreview,
  type AvatarPreviewProps as BaseAvatarPreviewProps,
} from "@/avatar/AvatarPreview";

export type AvatarPreviewProps = BaseAvatarPreviewProps;

export default function AvatarPreview(props: AvatarPreviewProps) {
  return <BaseAvatarPreview {...props} />;
}
