import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'traditional-form';
  userform!: FormGroup;

  isEditInProgress: boolean = false;
  formDataStored: any = [];
  isModalVisible: boolean = false;

  constructor(private _formBuilder: FormBuilder) {
    this.userform = this._formBuilder.group({
      id: [''],
      firstName: [''],
      lastName: [''],
      email: [''],
      dateofbirth: [''],
      contactNumber: [''],
      profilePic: ['null'],
    });
  }

  ngOnInit(): void {
    const storedData = localStorage.getItem('angularcrud');
    if (storedData) {
      this.formDataStored = JSON.parse(storedData);
    } else {
      this.formDataStored = [];
    }
  }

  submitUserForm() {
    const currentValue = this.userform.value;
    currentValue.id = this.formDataStored.length + 1;
    this.formDataStored.push(currentValue);
    localStorage.setItem('angularcrud', JSON.stringify(this.formDataStored));
    this.userform.reset();
  }

  toggleModal() {
    this.isModalVisible = !this.isModalVisible;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.userform.patchValue({
          profilePic: reader.result as string,
        });
        this.userform.get('profilePic')?.markAsDirty();
      };
      reader.readAsDataURL(file);
    }
  }

  handleEdit(item: any) {
    const index = this.formDataStored.findIndex(
      (storedItem: any) => storedItem.id === item.id
    );
    if (index !== -1) {
      const valueToEdit = this.formDataStored[index];
      this.userform.patchValue(valueToEdit);
    } else {
      alert('Item not found');
    }
  }

  handleUpdate(item: any) {
    const updatedData = this.userform.value;
    const index = this.formDataStored.findIndex(
      (storedItem: any) => storedItem.id === item.id
    );
    if (index !== -1) {
      this.formDataStored[index] = updatedData;
      localStorage.setItem('angularcrud', JSON.stringify(this.formDataStored));
      this.userform.reset();
    } else {
      alert('Item not found');
    }
  }

  handleDelete(item: any) {
    const index = this.formDataStored.findIndex(
      (storedItem: any) => storedItem.id === item.id
    );
    if (index !== -1) {
      this.formDataStored.splice(index, 1);
      localStorage.setItem('angularcrud', JSON.stringify(this.formDataStored));
    } else {
      alert('Item not found');
    }
  }
}
