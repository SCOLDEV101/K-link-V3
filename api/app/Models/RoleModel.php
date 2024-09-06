<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoleModel extends Model
{
    protected $guard = [ 'roleID','roleName','status' ];

    public static $roleModel = [
        ['roleID'=>'100','roleName'=>'User','status'=>1],
        ['roleID'=>'500','roleName'=>'Admin','status'=>1],
        ['roleID'=>'900','roleName'=>'Super Admin','status'=>1],
    ];

    use HasFactory;
}
