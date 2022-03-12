<?= csrf_field() ?>
<?php if (session()->getFlashData('success')): ?>
<div class="alert alert-success">
	<span class="alert-icon"><i class="ni ni-like-2"></i></span>
	<span><?= session()->getFlashData('success') ?></span>
	<button type="button" class="close" data-dismiss="alert" aria-label="Close">
	<span aria-hidden="true">&times;</span>
	</button>
</div>
<?php endif ?>
<?php if(session()->getFlashData('validation')): ?>
<div class="alert alert-danger" role="alert">
	<?php foreach ((array) session()->getFlashData('validation') as $key => $value): ?>
	<li>
		<?= $value ?>
	</li>
	<?php endforeach; ?>
</div>
<?php endif; ?>