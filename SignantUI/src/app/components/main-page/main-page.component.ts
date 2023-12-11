import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignantService } from '../../services/signant.service';
import { SignaturePostingsService } from '../../services/signature-postings.service';
import { SignaturePostingResponse } from '../signature-posting/signature-posting.interface';
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements OnInit {
  postingStatus: string = ''; // todo use value in signaturepostingservice instead
  signaturePostings: SignaturePostingResponse[] = [];

  constructor(
    private router: Router,
    private signantService: SignantService,
    private signaturePostingsService: SignaturePostingsService
  ) {}

  ngOnInit(): void {
    this.signaturePostings =
      this.signaturePostingsService.getSignaturePostings();
  }

  navigateToSignatureForm(): void {
    this.router.navigate(['/signature-form']);
  }

  getPostingStatus(postingID: string): void {
    this.signantService.getPostingStatus(postingID).subscribe(
      (response: any) => {
        console.log('Posting Status:', response.status);
        alert('Posting Status: ' + response.status);
        this.signaturePostingsService.setSignaturePostingStatus(
          postingID,
          response.status
        );
      },
      (error: any) => {
        console.error('Error getting posting status:', error);
        alert('Error getting posting status: ' + error);
      }
    );
  }

  downloadFile(postingID: string, attachmentId: string): void {
    if (
      this.signaturePostingsService.getSignaturePosting(postingID)
        .postingStatus === 'Completed'
    ) {
      this.signantService.downloadAttachment(postingID, attachmentId).subscribe(
        (downloadedFile: any) => {
          console.log('Downloaded File:', downloadedFile);
          alert('Downloaded File: ' + downloadedFile);
        },
        (error) => {
          console.error('Error downloading file:', error);
          alert('Error downloading file: ' + error);
        }
      );
    } else {
      console.warn('File cannot be downloaded. Posting status is not signed.');
      alert('File cannot be downloaded. Posting status is not "completed".');
    }
  }
}
