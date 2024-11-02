import React from "react";
import { Card, Input, Button, Textarea, Dropdown, Spacer, Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { useMediaQuery } from 'react-responsive';
import {Select, SelectItem} from "@nextui-org/react";

const DiseaseForm = () => {
  const isSmallScreen = useMediaQuery({ maxWidth: 640 });
  
  return (
    <div className={`px-4 md:px-8 lg:px-16 py-8`}>
      {/* Breadcrumbs */}
      <Breadcrumbs className="mb-6">
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem href="/dashboard/diseases">Diseases</BreadcrumbItem>
        <BreadcrumbItem isCurrent href="/dashboard/diseases/add">Add</BreadcrumbItem>
      </Breadcrumbs>

      {/* Form Card */}
      <div className={`flex ${isSmallScreen ? 'flex-col' : 'flex-row'} justify-center items-center`}>
        <Card className="w-full max-w-lg p-6 shadow-lg">
          <form className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold text-center mb-2">ADD DISEASE INFORMATION</h3>

            {/* Disease Name */}
            <Input
              clearable
              label="Disease Name"
              placeholder="Enter disease name"
              fullWidth
            />

            {/* Disease Description */}
            <Textarea
              label="Description"
              placeholder="Enter a brief description"
              fullWidth
              minRows={3}
            />

            {/* Affected Region */}
            <Input
              label="Affected Region"
              placeholder="Enter affected region"
              fullWidth
            />

              <Select
                label="Favorite Animal"
                placeholder="Select an animal"
                fullWidth
              >
                  <SelectItem>Active</SelectItem>
                  <SelectItem>Controlled</SelectItem>
                  <SelectItem>Eradicated</SelectItem>
              </Select>

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

export default DiseaseForm;
