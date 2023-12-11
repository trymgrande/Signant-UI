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
        this.signaturePostingsService.setSignaturePostingStatus(
          postingID,
          response.status
        );
        alert('Posting status updated');
      },
      (error: any) => {
        console.error('Error getting posting status:', error);
        alert('Error getting posting status: ' + error);
      }
    );
  }

  downloadFile(postingID: string, attachmentId: string): void {
    if (
      this.signaturePostingsService.getSignaturePosting(postingID).status ==
      'Completed'
    ) {
      this.signantService.downloadAttachment(postingID, attachmentId).subscribe(
        (downloadedFile: any) => {
          const blob = new Blob([downloadedFile], { type: 'application/pdf' }); // adjust the MIME type as needed
          const url = window.URL.createObjectURL(blob);

          // Create a link to download
          const a = document.createElement('a');
          a.href = url;
          a.download = `Signed_document_${attachmentId}`;
          document.body.appendChild(a);
          a.click();

          // Clean up
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        },
        (error) => {
          console.error('Error downloading file:', error);
          alert('Error downloading file: ' + error);
        }
      );
    } else {
      console.warn('File cannot be downloaded. Posting status is not signed.');
      alert('File cannot be downloaded. Posting status is not "Completed".');
    }
  }
}
