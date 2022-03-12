<?= $this->extend('template') ?>
<?= $this->section('title') ?>
Create Brand
<?= $this->endSection() ?>
<?= $this->section('content') ?>
<div class="row mt-1">
	<div class="col-12">
		<div class="card mt-3">
			<div class="card-header">
				<div class="row align-items-center">
					<div class="col">
						<h6 class="text-light text-uppercase ls-1 mb-1"><?= isset($data['id']) ? 'Edit': 'Create' ?></h6>
					</div>
				</div>
			</div>
			<div class="card-body">
				<form action="<?= route_to($controller . '::create') ?>" method="post">
					<?= $this->include('component/alert-form') ?>
					<div class="row">
						<?php if(isset($data['id'])): ?>
						<input type="hidden" name="id" value="<?= $data['id']?>">
						<?php endif; ?>
						<div class="col-12">
							<div class="form-group">
								<label for="name" class="form-control-label">Name</label>
								<input autocomplete="off" id="name" value="<?= isset($data['name']) ? $data['name']: '' ?>" type="text" class="form-control form-control-alternative" name="name" placeholder="Required" required>
							</div>
							<div class="form-group">
								<label for="status" class="form-control-label">Status</label>
								<select name="status" id="status" class="form-control">
									<option value="">-- SELECT --</option>
									<option value="Not Available">Not Available</option>
									<option value="Available">Available</option>
								</select>
							</div>
						</div>
						<div class="col-12">
							<button type="submit" class="btn btn-primary">Save</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
<?= $this->endSection() ?>
<?= $this->section('js') ?>
<script>
$(document).ready(() => {
	const init = () => {
		var select = "<?= isset($data['status']) ? $data['status']: '' ?>"
		$('select[name="status"]').val(select)
	}
	init()
})
</script>
<?= $this->endSection() ?>
<?= $this->section('header') ?>
<!-- Header -->
<div class="header bg-primary pb-6">
	<div class="container-fluid">
		<div class="header-body">
			<div class="row align-items-center py-4">
				<div class="col-lg-6 col-7">
					<h6 class="h2 text-white d-inline-block mb-0">Create</h6>
					<nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
						<ol class="breadcrumb breadcrumb-links breadcrumb-dark">
							<li class="breadcrumb-item"><a href="/"><i class="fas fa-home"></i></a></li>
							<li class="breadcrumb-item"><a href="<?= route_to($controller.'::index') ?>"><?= $active ?></a></li>
							<li class="breadcrumb-item active" aria-current="page"><?= isset($data['id']) ? 'edit': 'create' ?></li>
						</ol>
					</nav>
				</div>
			</div>
		</div>
	</div>
</div>
<?= $this->endSection() ?>