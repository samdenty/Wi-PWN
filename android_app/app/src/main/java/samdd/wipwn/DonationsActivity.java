package samdd.wipwn;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import org.sufficientlysecure.donations.DonationsFragment;

public class DonationsActivity extends FragmentActivity {
    private static final String GOOGLE_PUBKEY = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnR1zMddz9lURDn3V0v2pjW/Ls8JkpZQs1JcCJNQ2v9iSRcmtciRxruHxp4ih72xW3/5XP+xDzdaLO65lZUnzmDviwZzDk7kBHo6JQQdROyHk6Vpj+L9FXVKYtS19zhOMdEDI39rqxmxFrx0IgAMZtncZjAy+nqSaYSvVC6uyV20Dc8rixUqQ6PDhQ1Yw41YAp4XTak6CDhxyxvXwFcE2p2c51F3PASVmlicPbFjwaXVnf3AGosLgFrlMKLA2wDeiueB3pSzCIR7XE4rt8tA2tg1oZptVcAqy6nUUgm2uZbqIPrxZzHIZLqGgjF6e2Bxi0BOYE4eXsYBNHQuTAQBSSwIDAQAB";
    private static final String[] GOOGLE_CATALOG = new String[]{"wipwn.1", "wipwn.2", "wipwn.4", "wipwn.5", "wipwn.6", "wipwn.10", "wipwn.15"};
    /**
     * Called when the activity is first created.
     */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.donations_activity);

        FragmentTransaction ft = getSupportFragmentManager().beginTransaction();
        DonationsFragment donationsFragment;
        donationsFragment = DonationsFragment.newInstance(BuildConfig.DEBUG, true, GOOGLE_PUBKEY, GOOGLE_CATALOG,
                    getResources().getStringArray(R.array.donation_google_catalog_values), false, null, null,
                    null, false, null, null, false, null);

        ft.replace(R.id.donations_activity_container, donationsFragment, "donationsFragment");
        ft.commit();
    }

    /**
     * Needed for Google Play In-app Billing. It uses startIntentSenderForResult(). The result is not propagated to
     * the Fragment like in startActivityForResult(). Thus we need to propagate manually to our Fragment.
     */
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        FragmentManager fragmentManager = getSupportFragmentManager();
        Fragment fragment = fragmentManager.findFragmentByTag("donationsFragment");
        if (fragment != null) {
            fragment.onActivityResult(requestCode, resultCode, data);
        }
    }

}