import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

export default class Utils {
  static getFormErrors(form: AbstractControl) {
    if (form instanceof FormControl) {
      // Return FormControl errors or null
      return form.errors ?? null;
    }
    if (form instanceof FormGroup) {
      const groupErrors = form.errors;
      // Form group can contain errors itself, in that case add'em
      const formErrors = groupErrors ? { groupErrors } : {};
      Object.keys(form.controls).forEach((key) => {
        // Recursive call of the FormGroup fields
        const error = this.getFormErrors(form.get(key));
        if (error !== null) {
          // Only add error if not null
          formErrors[key] = error;
        }
      });
      // Return FormGroup errors or null
      return Object.keys(formErrors).length > 0 ? formErrors : null;
    }
  }

  // Mark form controls as touched
  static markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Paginate results
  static paginate(results, itemsPerPage) {
    let paginatedResults = [];

    let size = results.length;
    let pages = Math.floor(size / itemsPerPage);

    if (size % itemsPerPage > 0) pages++;

    let page = [];
    results.forEach((result) => {
      page.push(result);
      if (page.length == itemsPerPage) {
        paginatedResults.push(page);
        page = [];
      }
    });
    if (page.length > 0) paginatedResults.push(page);

    return paginatedResults;
  }
}
