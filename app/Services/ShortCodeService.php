<?php
declare(strict_types=1);

namespace App\Services;

use App\Models\ShortCode;
use RuntimeException;
use Illuminate\Support\Facades\Log;
use Exception;

final class ShortCodeService
{
    /**
     * The length of the generated code.
     */
    protected int $codeLength;

    /**
     * The maximum number of generation attempts.
     */
    protected int $maxAttempts;

    /**
     * The character set to use for generating codes.
     */
    protected string $characters;

    /**
     * The generated unique code.
     */
    protected ?string $code = null;

    /**
     * Initialize the service with configuration parameters.
     *
     * @param int $codeLength The length of codes to generate.
     * @param int $maxAttempts Maximum number of retry attempts.
     * @param string|null $characters Optional custom character set.
     */
    public function __construct(
        int $codeLength = 8,
        int $maxAttempts = 10,
        ?string $characters = null
    ) {
        $this->codeLength = $codeLength;
        $this->maxAttempts = $maxAttempts;
        $this->characters = $characters ?? '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    }

    /**
     * Retrieve the unique code, generating it if necessary.
     *
     * @return string
     * @throws RuntimeException If unable to generate a unique code.
     */
    public function getCode(): string
    {
        if ($this->code === null) {
            Log::info('Generating new short code', [
                'code_length' => $this->codeLength,
                'max_attempts' => $this->maxAttempts,
            ]);

            $this->code = $this->createUniqueCode();
        }

        return $this->code;
    }

    /**
     * Attempt to generate and store a unique short code.
     *
     * @return string
     * @throws RuntimeException If unable to create a unique code.
     */
    protected function createUniqueCode(): string
    {
        for ($attempt = 0; $attempt < $this->maxAttempts; $attempt++) {
            $newCode = $this->generateCode();

            if ($attempt > 0) {
                Log::debug('Retrying code generation after collision', [
                    'attempt'     => ($attempt + 1),
                    'max_attempts'=> $this->maxAttempts,
                ]);
            }

            try {
                $result = ShortCode::raw()->updateOne(
                    ['code' => $newCode],
                    [
                        '$setOnInsert' => [
                            'code'       => $newCode,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]
                    ],
                    ['upsert' => true]
                );

                if ($result->getUpsertedCount() === 1) {
                    $this->logSuccess($newCode, $attempt);
                    return $newCode;
                }
            } catch (Exception $e) {
                $this->logDatabaseError($newCode, $attempt, $e);
                throw new RuntimeException("Database error while generating code: " . $e->getMessage());
            }
        }

        Log::warning('Failed to generate unique code after maximum attempts', [
            'code_length'  => $this->codeLength,
            'max_attempts' => $this->maxAttempts,
        ]);

        throw new RuntimeException("Failed to generate unique code after {$this->maxAttempts} attempts");
    }

    /**
     * Generate a random code using a secure random generator.
     *
     * @return string
     */
    protected function generateCode(): string
    {
        $code = '';
        $maxIndex = mb_strlen($this->characters) - 1;
        for ($i = 0; $i < $this->codeLength; $i++) {
            $randomIndex = random_int(0, $maxIndex);
            $code .= mb_substr($this->characters, $randomIndex, 1);
        }
        return $code;
    }

    /**
     * Log a successful code generation.
     *
     * @param string $code
     * @param int $attempt
     * @return void
     */
    protected function logSuccess(string $code, int $attempt): void
    {
        Log::info('Successfully generated and stored new short code', [
            'code' => $code,
            'attempts' => $attempt + 1,
        ]);
    }

    /**
     * Log a database error during code generation.
     *
     * @param string $code
     * @param int $attempt
     * @param Exception $e
     * @return void
     */
    protected function logDatabaseError(string $code, int $attempt, Exception $e): void
    {
        Log::error('Database error while generating code', [
            'code'            => $code,
            'attempt'         => $attempt + 1,
            'error'           => $e->getMessage(),
            'exception_class' => get_class($e),
        ]);
    }
}
