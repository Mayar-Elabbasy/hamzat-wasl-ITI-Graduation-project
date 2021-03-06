<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeTypeBooleanToEnumInStatusColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_workshop', function (Blueprint $table) {
            $table->enum('status' ,['Pending' , 'Accepted'])->default('Pending');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_workshop', function (Blueprint $table) {
            $table->dropColumn(['status']);
        });
    }
}
