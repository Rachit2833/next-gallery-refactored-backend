"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useUser } from "../_lib/context";
import { useEffect, useState } from "react";

const PrivacyControlSection = ({ privacySettings }) => {
  const { personalDetails, setPersonalDetails } = useUser();

  const [shareDetails, setShareDetails] = useState(
    privacySettings?.details ?? false
  );
  const [locationAccess, setLocationAccess] = useState(
    privacySettings?.location ?? false
  );
  const [locationPermission, setLocationPermission] = useState("prompt"); // 'granted' | 'denied' | 'prompt'
  const [locationError, setLocationError] = useState("");

  // Check geolocation permission on load
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator?.permissions) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((result) => {
          setLocationPermission(result.state);

          if (result.state === "granted") {
            setLocationAccess(true);
          }

          result.onchange = () => {
            setLocationPermission(result.state);
          };
        })
        .catch(() => {
          setLocationPermission("prompt");
        });
    }
  }, []);

  // Handle toggle logic
  const handleLocationToggle = async (checked) => {
    setLocationError("");

    if (checked) {
      // Ask for permission only if not already granted
      if (locationPermission !== "granted") {
        try {
          await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          setLocationAccess(true);
          setLocationPermission("granted");
        } catch (err) {
          setLocationAccess(false);
          setLocationPermission("denied");
          setLocationError("Location permission denied. Enable it in browser settings.");
        }
      } else {
        setLocationAccess(true);
      }
    } else {
      setLocationAccess(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl border border-border bg-card shadow-md rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl text-foreground">
          Privacy Controls
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Manage how your data is used and what others can see.
        </p>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        {/* SEO Visibility */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <Label
              htmlFor="seo-visibility"
              className="font-medium text-foreground"
            >
              Allow Search Engines
            </Label>
            <p className="text-sm text-muted-foreground max-w-sm">
              Let search engines index your profile for discoverability.
            </p>
          </div>
          <Switch
            id="seo-visibility"
            checked={personalDetails}
            onCheckedChange={setPersonalDetails}
            className="data-[state=checked]:bg-primary"
          />
        </div>

        {/* Personal Info Visibility */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <Label
              htmlFor="show-details"
              className="font-medium text-foreground"
            >
              Share Personal Info
            </Label>
            <p className="text-sm text-muted-foreground max-w-sm">
              Control whether your name and profile details are visible to
              others.
            </p>
          </div>
          <Switch
            id="show-details"
            checked={shareDetails}
            onCheckedChange={setShareDetails}
            className="data-[state=checked]:bg-primary"
          />
        </div>

        {/* Location Access */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <Label
              htmlFor="location-access"
              className="font-medium text-foreground"
            >
              Enable Location Access
            </Label>
            <p className="text-sm text-muted-foreground max-w-sm">
              Allow us to use your location to personalize content and features.
            </p>
            {locationError && (
              <p className="text-sm text-destructive mt-1">{locationError}</p>
            )}
            {locationPermission === "granted" && !locationError && (
              <p className="text-sm text-green-600 mt-1">
                Location permission is granted.
              </p>
            )}
          </div>

          <Switch
            disabled={true}
            id="location-access"
            checked={locationAccess}
            onCheckedChange={handleLocationToggle}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacyControlSection;
