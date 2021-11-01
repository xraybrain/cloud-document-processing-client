import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NewFolderRequest } from 'src/app/models/document.model';
import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'app-new-folder-modal',
  templateUrl: './new-folder-modal.component.html',
  styleUrls: ['./new-folder-modal.component.css']
})
export class NewFolderModalComponent implements OnInit {
  processing = false;
  formData: FormGroup;

  @Input()
  folder: number;

  constructor(
    private toaster: ToastrService,
    private modal: NgbActiveModal,
    private documentService: DocumentService) { }

  ngOnInit() {
    this.formData = new FormGroup({
      name: new FormControl('', [Validators.required])
    });
  }

  get f() {
    return this.formData.controls;
  }

  close() {
    this.modal.close();
  }

  onCreateFolder() {
    if (this.processing) {
      return;
    }

    this.toaster.info('Creating...', '', { disableTimeOut: true });
    const request = new NewFolderRequest(this.formData.value.name, this.folder);

    this.documentService.createFolder(request).subscribe((feedback) => {
      this.toaster.clear();
      this.processing = false;
      if (feedback.success) {
        this.toaster.success('Created.', '', { timeOut: 2000 });
        this.modal.close(feedback.result);
      } else {
        this.toaster.warning(feedback.message);
      }
    });
  }

}
