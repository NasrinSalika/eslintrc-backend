export class CreateContactDto {
  name: string;
  title: string;
  department: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  images: Array<string>;
  projectId: string;
  createdBy: string;
  editId: string;
  biovideolink: string;
  role: string;
}
