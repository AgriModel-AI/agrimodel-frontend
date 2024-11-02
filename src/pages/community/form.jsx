import React from "react";
import { Card, Input, Button, Textarea, Select, Spacer, Breadcrumbs, BreadcrumbItem, SelectItem } from "@nextui-org/react";
import { useMediaQuery } from 'react-responsive';

const CommunityForm = () => {
  const isSmallScreen = useMediaQuery({ maxWidth: 640 });
  
  return (
    <div className={`px-4 md:px-8 lg:px-16 py-8`}>
      {/* Breadcrumbs */}
      <Breadcrumbs className="mb-6">
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem href="/dashboard/communities">Communities</BreadcrumbItem>
        <BreadcrumbItem isCurrent href="/dashboard/communities/add">Add</BreadcrumbItem>
      </Breadcrumbs>

      {/* Form Card */}
      <div className={`flex ${isSmallScreen ? 'flex-col' : 'flex-row'} justify-center items-center`}>
        <Card className="w-full max-w-lg p-6 shadow-lg">
          <form className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold text-center mb-2">ADD COMMUNITY INFORMATION</h3>

            {/* Community Name */}
            <Input
              clearable
              label="Region"
              placeholder="Enter the community's region"
              fullWidth
            />

            {/* Community Description */}
            <Textarea
              label="Description"
              placeholder="Enter a brief description of the community"
              fullWidth
              minRows={3}
            />

            {/* Region */}
            <Input
              label="Region"
              placeholder="Enter the community's region"
              fullWidth
            />

            {/* Status */}
            <Select
              label="Status"
              placeholder="Select community status"
              fullWidth
            >
              <SelectItem key="active">Active</SelectItem>
              <SelectItem key="inactive">Inactive</SelectItem>
              <SelectItem key="archived">Archived</SelectItem>
            </Select>

            {/* File Upload */}
            <Input
              type="file"
              accept=".jpg,.png,.pdf"
              fullWidth
            />

            {/* Submit Button */}
            <Spacer y={1} />
            <Button color="primary" type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CommunityForm;
