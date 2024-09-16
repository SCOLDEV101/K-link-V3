<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Spatie\PdfToImage\Pdf;
use Exception;

class pdfToImage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $filename;

    /**
     * Create a new job instance.
     *
     * @param string $filename
     * @return void
     */
    public function __construct(string $filename)
    {
        $this->filename = $filename;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    
    public function handle(): void
    {
        try {
            // Get the path to the PDF
            $filepath = public_path('uploaded\\Library\\' . $this->filename);
            $pdf = new Pdf($filepath);

            // Create new folder for images if not exists
            $justname = basename($this->filename, '.pdf');
            $imagePath = public_path('pdfImage\\' . $justname);
            if (!File::exists($imagePath)) {
                File::makeDirectory($imagePath, 0755, true, true);

                // Get page number
                $totalPages = $pdf->getNumberOfPages();
                for ($page = 1; $page <= $totalPages; $page++) {
                    // Save the first page of the PDF as an image
                    $pdf->setPage($page)->saveImage($imagePath . "\\output_page_$page.jpg");
                }
            }
            else true;
        } catch (Exception $error) {
            Log::error('Error occurred: ' . $error->getMessage(), [
                'exception' => $error
            ]);
        }
    }
}
