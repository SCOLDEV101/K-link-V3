<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookmarkModel extends Model
{
    protected $fillable = [
        'groupID',
        'userID',
    ];

    public function group(): BelongsTo  {
        return $this->belongsTo(GroupModel::class, 'groupID', 'id');
    }

    use HasFactory;
}
